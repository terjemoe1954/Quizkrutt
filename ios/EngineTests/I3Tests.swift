import XCTest
@testable import QuizkruttEngine

@MainActor final class MemoryOnlineVault: OnlineVault {
    var ledger = OnlineLedger(); var fail = false
    func load() throws -> OnlineLedger {ledger}
    func save(_ value: OnlineLedger) throws {if fail {throw OnlineFailure.storage}; ledger = value}
}
@MainActor final class ScriptedOnlineTransport: OnlineTransport {
    var queue: [Result<Data,OnlineFailure>] = []
    var requests: [(String,Data?,String?)] = []
    func request(path: String, body: Data?, token: String?) async throws -> Data {
        requests.append((path,body,token)); guard !queue.isEmpty else {throw OnlineFailure.network}; return try queue.removeFirst().get()
    }
}
@MainActor final class I3Tests: XCTestCase {
    func fixture(_ revision: Int = 1, own: Int? = nil, completed: Bool = false) throws -> Data {
        let review: [String:Any] = ["index":0,"question":"Testspørsmål?","options":["A","B","C","D"],"correct":0,"explanation":"Forklaring.","answers":[0,1]]
        let data: [String:Any] = ["id":"00000000-0000-0000-0000-000000000001","code":"ABCDEFGH","revision":revision,"status":"playing","player":0,"names":["Ada","Bo"],"category":"mix","level":0,"count":5,"completed":completed ? 1:0,"scores":completed ? [100,0]:[0,0],"submitted":completed ? 1:own == nil ? 0:1,"opponentAnswered":false,"ownAnswer":own as Any? ?? NSNull(),"question":["index":completed ? 1:0,"question":"Neste?","options":["A","B","C","D"]],"reviews":completed ? [review]:[],"inviteUntil":1890000000000.0,"expiresAt":1890600000000.0,"cancelledBy":NSNull()]
        return try JSONSerialization.data(withJSONObject:data)
    }
    func testResponseContractRejectsEarlyAnswerAndForgedScores() async throws {
        let data = try fixture(); _ = try OnlineRoom.decode(data)
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with:data) as? [String:Any])
        var q = try XCTUnwrap(object["question"] as? [String:Any]); q["correct"] = 0; object["question"] = q
        XCTAssertThrowsError(try OnlineRoom.decode(JSONSerialization.data(withJSONObject:object)))
        object = try XCTUnwrap(JSONSerialization.jsonObject(with:data) as? [String:Any]); object["scores"] = [500,0]
        XCTAssertThrowsError(try OnlineRoom.decode(JSONSerialization.data(withJSONObject:object)))
    }
    func testWriteFailureSendsNothingAndLostCreateRetriesSameToken() async throws {
        let vault = MemoryOnlineVault(), transport = ScriptedOnlineTransport(); let store = OnlineStore(transport:transport,vault:vault)
        vault.fail = true; await store.begin(name:"Ada",category:"mix",level:0)
        XCTAssertEqual(transport.requests.count,0); XCTAssertTrue(store.ledger.entries.isEmpty)
        vault.fail = false; transport.queue = [.failure(.network),.success(try fixture())]
        await store.begin(name:"Ada",category:"mix",level:0); XCTAssertNotNil(store.entry?.pendingAction)
        await store.retryPending(); XCTAssertEqual(transport.requests.count,2); XCTAssertEqual(transport.requests[0].1,transport.requests[1].1)
        XCTAssertNotNil(store.entry?.roomID); XCTAssertNil(store.entry?.pendingAction)
    }
    func testAnswerUncertaintySurvivesRestartAndRetriesIdentically() async throws {
        let vault = MemoryOnlineVault(), transport = ScriptedOnlineTransport(); let store = OnlineStore(transport:transport,vault:vault)
        transport.queue = [.success(try fixture()),.failure(.network)]
        await store.begin(name:"Ada",category:"mix",level:0); await store.answer(0)
        XCTAssertEqual(store.entry?.pendingAnswer,PendingOnlineAnswer(index:0,choice:0))
        await store.answer(1); XCTAssertEqual(transport.requests.count,2)
        let restored = OnlineStore(transport:transport,vault:vault), id = try XCTUnwrap(store.selected)
        transport.queue = [.success(try fixture()),.success(try fixture(2,own:0))]
        await restored.resume(id); await restored.retryAnswer()
        let original = try JSONDecoder().decode(PendingOnlineAnswer.self,from:XCTUnwrap(transport.requests[1].1))
        let retried = try JSONDecoder().decode(PendingOnlineAnswer.self,from:XCTUnwrap(transport.requests.last?.1))
        XCTAssertEqual(original,retried); XCTAssertEqual(transport.requests[1].2,transport.requests.last?.2)
        XCTAssertNil(restored.entry?.pendingAnswer); XCTAssertEqual(restored.room?.ownAnswer,0)
    }
    func testReviewAndOldRevisionProtection() async throws {
        let vault = MemoryOnlineVault(), transport = ScriptedOnlineTransport(); let store = OnlineStore(transport:transport,vault:vault)
        transport.queue = [.success(try fixture(4,completed:true)),.success(try fixture(2))]
        await store.begin(name:"Ada",category:"mix",level:0); await store.refresh()
        XCTAssertEqual(store.room?.revision,4); XCTAssertEqual(store.room?.reviews.count,1)
        vault.fail = true; store.acknowledge(); XCTAssertEqual(store.entry?.reviewed,0)
        vault.fail = false; store.acknowledge(); store.acknowledge(); XCTAssertEqual(store.entry?.reviewed,1)
    }
    func testCookieScopeAndSecureTokens() async throws {
        let a = try OnlineStore.token(), b = try OnlineStore.token(); XCTAssertNotEqual(a,b); XCTAssertEqual(a.count,64)
        func cookie(_ domain:String,_ path:String = "/",secure:Bool = true) -> HTTPCookie {
            HTTPCookie(properties:[.domain:domain,.path:path,.name:domain+path,.value:"value",.secure:secure ? "TRUE":"FALSE"])!
        }
        let cookies = [cookie("quizkrutt.terjemoe54.chatgpt.site"),cookie("other.chatgpt.site"),cookie(".chatgpt.site"),cookie("quizkrutt.terjemoe54.chatgpt.site","/api-other")]
        let url = URL(string:"https://quizkrutt.terjemoe54.chatgpt.site/api/rooms")!
        XCTAssertEqual(HTTPOnlineTransport.matchingCookies(cookies,url:url).count,2)
        XCTAssertEqual(HTTPOnlineTransport.matchingCookies(cookies,url:URL(string:"https://evil.example/api/rooms")!).count,0)
        XCTAssertEqual(HTTPOnlineTransport.matchingCookies(cookies,url:URL(string:"http://quizkrutt.terjemoe54.chatgpt.site/api/rooms")!).count,0)
    }
    func testInvalidNamesAndCodesMakeNoRequests() async throws {
        let vault = MemoryOnlineVault(), transport = ScriptedOnlineTransport(); let store = OnlineStore(transport:transport,vault:vault)
        await store.begin(name:"",category:"mix",level:0); await store.begin(name:"Ada",code:"INVALID0"); await store.begin(name:"Ada",category:"unknown",level:0)
        XCTAssertTrue(transport.requests.isEmpty); XCTAssertTrue(store.ledger.entries.isEmpty)
    }
}

@MainActor final class DropOneAnswerResponse: OnlineTransport {
    let underlying: HTTPOnlineTransport; var dropped = false
    init(origin:URL) {underlying = HTTPOnlineTransport(origin:origin)}
    func request(path:String,body:Data?,token:String?) async throws -> Data {
        let data = try await underlying.request(path:path,body:body,token:token)
        if path.hasSuffix("/answer"), !dropped {dropped = true; throw OnlineFailure.network}
        return data
    }
}
@MainActor final class I3LiveTests: XCTestCase {
    func testTwoNativeClientsWithRealServerReplayRestartAndCancellation() async throws {
        guard let raw = ProcessInfo.processInfo.environment["QUIZKRUTT_INTEGRATION_ORIGIN"], let origin = URL(string:raw), origin.host == "127.0.0.1" else {throw XCTSkip("Set local integration origin to test the actual server")}
        let hostVault = MemoryOnlineVault(), guestVault = MemoryOnlineVault()
        let flaky = DropOneAnswerResponse(origin:origin)
        var host = OnlineStore(transport:flaky,vault:hostVault)
        let guest = OnlineStore(transport:HTTPOnlineTransport(origin:origin),vault:guestVault)
        await host.begin(name:"Native A",category:"mix",level:0)
        let code = try XCTUnwrap(host.room?.code)
        await guest.begin(name:"Native B",code:code); await host.refresh()
        XCTAssertEqual(host.room?.id,guest.room?.id)
        for index in 0..<5 {
            XCTAssertEqual(host.room?.question?.index,index); XCTAssertEqual(host.room?.reviews.count,index)
            await host.answer(0)
            if index == 0 {
                XCTAssertNotNil(host.entry?.pendingAnswer)
                let savedID = try XCTUnwrap(host.selected)
                host = OnlineStore(transport:flaky,vault:hostVault); await host.resume(savedID)
                XCTAssertNil(host.entry?.pendingAnswer); XCTAssertEqual(host.room?.submitted,1)
            }
            XCTAssertEqual(host.room?.completed,index); XCTAssertEqual(host.room?.reviews.count,index)
            await guest.answer(1); await host.refresh()
            XCTAssertEqual(host.room?.completed,index+1)
            host.acknowledge(); guest.acknowledge()
        }
        XCTAssertEqual(host.room?.status,"finished"); XCTAssertEqual(guest.room?.status,"finished"); XCTAssertEqual(host.room?.scores,guest.room?.scores)
        let scores = try XCTUnwrap(host.room?.scores)
        XCTAssertEqual(scores,host.room?.reviews.reduce(into:[0,0]) {n,r in for p in 0..<2 {n[p] += r.answers[p] == r.correct ? 100:0}})
        await host.begin(name:"Native C",category:"nature",level:1)
        await guest.begin(name:"Native D",code:try XCTUnwrap(host.room?.code)); await host.refresh(); await guest.cancel(); await host.refresh()
        XCTAssertEqual(host.room?.status,"cancelled"); XCTAssertEqual(guest.room?.status,"cancelled")
    }
}

final class OnlineHTTPStub: URLProtocol, @unchecked Sendable {
    nonisolated(unsafe) static var status = 200
    nonisolated(unsafe) static var mime = "text/html"
    nonisolated(unsafe) static var payload = Data("<html>Logg inn</html>".utf8)
    nonisolated(unsafe) static var captured: URLRequest?
    override class func canInit(with request:URLRequest) -> Bool {true}
    override class func canonicalRequest(for request:URLRequest) -> URLRequest {request}
    override func startLoading() {
        Self.captured = request
        let response = HTTPURLResponse(url:request.url!,statusCode:Self.status,httpVersion:nil,headerFields:["Content-Type":Self.mime])!
        client?.urlProtocol(self,didReceive:response,cacheStoragePolicy:.notAllowed)
        client?.urlProtocol(self,didLoad:Self.payload); client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() {}
}
@MainActor final class I3HTTPTests: XCTestCase {
    func testLoginHTMLRejectedAndCredentialOnlySentToSite() async throws {
        let configuration = URLSessionConfiguration.ephemeral; configuration.protocolClasses = [OnlineHTTPStub.self]
        OnlineHTTPStub.status = 200; OnlineHTTPStub.mime = "text/html"; OnlineHTTPStub.payload = Data("<html>Logg inn</html>".utf8)
        let good = HTTPCookie(properties:[.domain:"quizkrutt.terjemoe54.chatgpt.site",.path:"/",.name:"site-session",.value:"test-session",.secure:"TRUE"])!
        let other = HTTPCookie(properties:[.domain:"other.example",.path:"/",.name:"unrelated",.value:"never-send",.secure:"TRUE"])!
        let transport = HTTPOnlineTransport(origin:URL(string:"https://quizkrutt.terjemoe54.chatgpt.site")!,cookies:{[good,other]},configuration:configuration)
        do {_ = try await transport.request(path:"/api/rooms",body:Data("{}".utf8),token:String(repeating:"a",count:64)); XCTFail("HTML must never be accepted as an API response")}
        catch OnlineFailure.login {} catch {XCTFail("Expected login requirement")}
        XCTAssertEqual(OnlineHTTPStub.captured?.url?.host,"quizkrutt.terjemoe54.chatgpt.site")
        XCTAssertEqual(OnlineHTTPStub.captured?.value(forHTTPHeaderField:"Cookie"),"site-session=test-session")
        XCTAssertNil(OnlineHTTPStub.captured?.value(forHTTPHeaderField:"OAI-Sites-Authorization"))
        OnlineHTTPStub.status = 404; OnlineHTTPStub.mime = "application/json"; OnlineHTTPStub.payload = Data("{\"error\":\"Ukjent rom\"}".utf8)
        do {_ = try await transport.request(path:"/api/rooms",body:nil,token:nil); XCTFail("404 must be an error")}
        catch OnlineFailure.server(404,let message) {XCTAssertEqual(message,"Ukjent rom")} catch {XCTFail("Expected server 404")}
    }
    func testPrivateProductionGateWithoutSessionRequiresLogin() async throws {
        guard ProcessInfo.processInfo.environment["QUIZKRUTT_PRIVATE_GATE_CHECK"] == "1" else {throw XCTSkip("Optional read-only private gate check")}
        let transport = HTTPOnlineTransport(origin:URL(string:"https://quizkrutt.terjemoe54.chatgpt.site")!)
        do {_ = try await transport.request(path:"/api/rooms/00000000-0000-0000-0000-000000000000",body:nil,token:nil); XCTFail("Owner-private API must require sign-in")}
        catch OnlineFailure.login {} catch {XCTFail("Expected private sign-in gate")}
    }
}

@MainActor final class I3TimeoutTests: XCTestCase {
    func testCookieProviderCannotLeaveInterfaceBusyForever() async throws {
        let transport = HTTPOnlineTransport(origin:URL(string:"https://quizkrutt.terjemoe54.chatgpt.site")!,cookies:{
            try? await Task.sleep(nanoseconds:100_000_000); return []
        },cookieTimeout:10_000_000)
        do {_ = try await transport.request(path:"/api/rooms",body:nil,token:nil); XCTFail("Cookie wait must time out before networking")}
        catch OnlineFailure.network {} catch {XCTFail("Expected bounded network failure")}
        // The late callback must be ignored, without a double-resume crash.
        try await Task.sleep(nanoseconds:150_000_000)
    }
}
