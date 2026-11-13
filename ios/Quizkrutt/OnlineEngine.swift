import Foundation
import Combine
import Security

struct OnlineQuestion: Codable, Equatable {let index: Int; let question: String; let options: [String]}
struct OnlineReview: Codable, Equatable {
    let index: Int; let question: String; let options: [String]; let correct: Int; let explanation: String; let answers: [Int]
}
struct OnlineRoom: Codable, Equatable {
    let id: String; let code: String; let revision: Int; let status: String; let player: Int
    let names: [String?]; let category: String; let level: Int; let count: Int; let completed: Int
    let scores: [Int]; let submitted: Int; let opponentAnswered: Bool; let ownAnswer: Int?
    let question: OnlineQuestion?; let reviews: [OnlineReview]; let inviteUntil: Double; let expiresAt: Double; let cancelledBy: Int?
    var terminal: Bool {["finished","cancelled","expired","invite-expired"].contains(status)}
    func validate() throws {
        guard UUID(uuidString:id) != nil, code.range(of:"^[A-HJ-NP-Z2-9]{8}$",options:.regularExpression) != nil,
              revision > 0, ["waiting","playing","finished","cancelled","expired","invite-expired"].contains(status),
              (0...1).contains(player), names.count == 2, names[0] != nil, names[player] != nil,
              names.compactMap({$0}).allSatisfy({!$0.isEmpty && $0.count <= 40}),
              ["mix","world","nature","culture","sport","science"].contains(category), (0...2).contains(level),
              count == 5, (0...count).contains(completed), scores.count == 2,
              reviews.count == completed, (completed...min(count,completed+1)).contains(submitted),
              cancelledBy == nil || (0...1).contains(cancelledBy!), inviteUntil.isFinite, expiresAt.isFinite else {throw OnlineFailure.invalidResponse}
        for (i,r) in reviews.enumerated() {
            guard r.index == i, !r.question.isEmpty, r.options.count == 4, Set(r.options).count == 4,
                  (0...3).contains(r.correct), r.answers.count == 2, r.answers.allSatisfy({(0...3).contains($0)}) else {throw OnlineFailure.invalidResponse}
        }
        let expected = (0..<2).map {p in reviews.reduce(0) {$0 + ($1.answers[p] == $1.correct ? 100:0)}}
        guard scores == expected else {throw OnlineFailure.invalidResponse}
        if status == "playing" {
            guard names[1] != nil, completed < count, let q = question, q.index == completed,
                  !q.question.isEmpty, q.options.count == 4, Set(q.options).count == 4,
                  (submitted > completed) == (ownAnswer != nil), ownAnswer == nil || (0...3).contains(ownAnswer!) else {throw OnlineFailure.invalidResponse}
        } else if question != nil {throw OnlineFailure.invalidResponse}
        if status == "finished" {guard completed == count, submitted == count else {throw OnlineFailure.invalidResponse}}
    }
    static func decode(_ data: Data) throws -> Self {
        do {
        // Reject early-answer fields even if a future server accidentally adds them.
        if let object = try JSONSerialization.jsonObject(with:data) as? [String:Any], let q = object["question"] as? [String:Any], !Set(q.keys).isSubset(of:["index","question","options"]) {throw OnlineFailure.invalidResponse}
        let room = try JSONDecoder().decode(Self.self,from:data); try room.validate(); return room
        } catch {throw OnlineFailure.invalidResponse}
    }
}
enum OnlineFailure: Error, LocalizedError {
    case login, network, invalidResponse, storage, message(String), server(Int,String)
    var errorDescription: String? {
        switch self {
        case .login: return "Nettduellserveren er ikke tilgjengelig som forventet. Prøv igjen senere."
        case .network: return "Ingen bekreftelse fra serveren. Kontroller nettet og prøv igjen. Et svar kan allerede være lagret."
        case .invalidResponse: return "Serverens svar kunne ikke kontrolleres. Prøv å oppdatere status."
        case .storage: return "Spilleradgangen kunne ikke lagres i nøkkelringen. Ingen ny handling ble sendt. Prøv igjen før du lukker appen."
        case .message(let text), .server(_,let text): return text
        }
    }
}
struct PendingOnlineAnswer: Codable, Equatable {let index: Int; let choice: Int}
struct PendingOnlineAction: Codable, Equatable {let action: String; let name: String; let category: String?; let level: Int?; let code: String?}
struct OnlineEntry: Codable, Identifiable {
    let id: UUID; let token: String; let name: String; let createdAt: Date
    var roomID: String?; var code: String?; var reviewed = 0
    var pendingAction: PendingOnlineAction?; var pendingAnswer: PendingOnlineAnswer?
}
struct OnlineLedger: Codable {
    var version = 1
    var entries: [OnlineEntry] = []
    func validate() throws {
        guard version == 1, Set(entries.map(\.id)).count == entries.count else {throw OnlineFailure.storage}
        for e in entries {
            guard e.token.range(of:"^[a-f0-9]{64}$",options:.regularExpression) != nil, !e.name.isEmpty, e.name.count <= 20,
                  (0...5).contains(e.reviewed), e.roomID == nil || UUID(uuidString:e.roomID!) != nil,
                  e.code == nil || e.code!.range(of:"^[A-HJ-NP-Z2-9]{8}$",options:.regularExpression) != nil,
                  e.roomID != nil || e.pendingAction != nil else {throw OnlineFailure.storage}
            if let a = e.pendingAnswer {guard e.roomID != nil, (0..<5).contains(a.index), (0...3).contains(a.choice) else {throw OnlineFailure.storage}}
            if let p = e.pendingAction {guard ["create","join"].contains(p.action), p.name == e.name else {throw OnlineFailure.storage}}
        }
    }
}
@MainActor protocol OnlineVault {func load() throws -> OnlineLedger; func save(_ ledger: OnlineLedger) throws}
@MainActor struct KeychainOnlineVault: OnlineVault {
    let service: String
    var query: [String:Any] {[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:service,kSecAttrAccount as String:"rooms-v1"]}
    func load() throws -> OnlineLedger {
        var q = query; q[kSecReturnData as String] = true; q[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?; let status = SecItemCopyMatching(q as CFDictionary,&item)
        if status == errSecItemNotFound {return OnlineLedger()}
        guard status == errSecSuccess, let data = item as? Data else {throw OnlineFailure.storage}
        let ledger = try JSONDecoder().decode(OnlineLedger.self,from:data); try ledger.validate(); return ledger
    }
    func save(_ ledger: OnlineLedger) throws {
        try ledger.validate(); let data = try JSONEncoder().encode(ledger)
        let values: [String:Any] = [kSecValueData as String:data,kSecAttrAccessible as String:kSecAttrAccessibleWhenUnlockedThisDeviceOnly]
        let result = SecItemUpdate(query as CFDictionary,values as CFDictionary)
        if result == errSecItemNotFound {var q = query; values.forEach {q[$0.key] = $0.value}; guard SecItemAdd(q as CFDictionary,nil) == errSecSuccess else {throw OnlineFailure.storage}}
        else if result != errSecSuccess {throw OnlineFailure.storage}
    }
}
@MainActor protocol OnlineTransport {func request(path: String, body: Data?, token: String?) async throws -> Data}
final class RejectOnlineRedirects: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest, completionHandler: @escaping @Sendable (URLRequest?) -> Void) {completionHandler(nil)}
}
@MainActor final class HTTPOnlineTransport: OnlineTransport {
    let origin: URL
    let cookies: () async -> [HTTPCookie]
    private let session: URLSession
    private let cookieTimeout: UInt64
    init(origin: URL, cookies: @escaping () async -> [HTTPCookie] = {[]}, configuration: URLSessionConfiguration = .ephemeral, cookieTimeout: UInt64 = 12_000_000_000) {
        self.origin = origin; self.cookies = cookies; self.cookieTimeout = cookieTimeout
        configuration.httpShouldSetCookies = false; configuration.urlCache = nil; configuration.timeoutIntervalForRequest = 12
        session = URLSession(configuration:configuration,delegate:RejectOnlineRedirects(),delegateQueue:nil)
    }
    static func matchingCookies(_ cookies: [HTTPCookie], url: URL) -> [HTTPCookie] {
        guard let host = url.host else {return []}
        return cookies.filter {c in
            let domain = c.domain.hasPrefix(".") ? String(c.domain.dropFirst()):c.domain
            let path = url.path
            let domainMatch = c.domain.hasPrefix(".") ? (host == domain || host.hasSuffix("."+domain)) : host == domain
            let pathMatch = path == c.path || (path.hasPrefix(c.path) && (c.path.hasSuffix("/") || path.dropFirst(c.path.count).hasPrefix("/")))
            return domainMatch && pathMatch && (!c.isSecure || url.scheme == "https") && (c.expiresDate == nil || c.expiresDate! > Date())
        }
    }
    private func boundedCookies() async throws -> [HTTPCookie] {
        let result: [HTTPCookie]? = await withCheckedContinuation { continuation in
            var finished = false
            let timeout = Task { @MainActor in
                do {try await Task.sleep(nanoseconds:cookieTimeout)} catch {return}
                if !finished {finished = true; continuation.resume(returning:nil)}
            }
            Task { @MainActor in
                let value = await cookies()
                if !finished {finished = true; timeout.cancel(); continuation.resume(returning:value)}
            }
        }
        guard let result else {throw OnlineFailure.network}
        return result
    }
    func request(path: String, body: Data?, token: String?) async throws -> Data {
        guard path.range(of:"^/api/rooms(?:/join|/[a-f0-9-]{36}(?:/answer|/cancel)?)?$",options:.regularExpression) != nil,
              let url = URL(string:path,relativeTo:origin)?.absoluteURL, url.host == origin.host else {throw OnlineFailure.invalidResponse}
        var request = URLRequest(url:url,cachePolicy:.reloadIgnoringLocalCacheData,timeoutInterval:12)
        request.httpMethod = body == nil ? "GET":"POST"; request.httpBody = body
        request.setValue("application/json",forHTTPHeaderField:"Accept")
        if body != nil {request.setValue("application/json",forHTTPHeaderField:"Content-Type")}
        if let token {request.setValue("Bearer "+token,forHTTPHeaderField:"Authorization")}
        for (key,value) in HTTPCookie.requestHeaderFields(with:Self.matchingCookies(try await boundedCookies(),url:url)) {request.setValue(value,forHTTPHeaderField:key)}
        do {
            let (data,response) = try await session.data(for:request)
            guard let http = response as? HTTPURLResponse else {throw OnlineFailure.invalidResponse}
            guard !(300...399).contains(http.statusCode), http.value(forHTTPHeaderField:"Content-Type")?.lowercased().contains("application/json") == true else {throw OnlineFailure.login}
            guard data.count <= 200_000 else {throw OnlineFailure.invalidResponse}
            if !(200...299).contains(http.statusCode) {
                if http.statusCode == 401 || http.statusCode == 403 {throw OnlineFailure.login}
                let message = (try? JSONDecoder().decode(ServerMessage.self,from:data).error) ?? "Handlingen ble ikke bekreftet. Oppdater og prøv igjen."
                throw OnlineFailure.server(http.statusCode,String(message.prefix(300)))
            }
            return data
        } catch let error as OnlineFailure {throw error}
        catch {throw OnlineFailure.network}
    }
    private struct ServerMessage: Decodable {let error: String}
}

@MainActor final class OnlineStore: ObservableObject {
    @Published private(set) var ledger = OnlineLedger()
    @Published private(set) var room: OnlineRoom?
    @Published private(set) var selected: UUID?
    @Published private(set) var busy = false
    @Published var error: String?
    @Published var needsLogin = false
    @Published private(set) var storageBlocked = false
    let transport: any OnlineTransport
    private let vault: any OnlineVault
    init(transport: any OnlineTransport, vault: any OnlineVault) {
        self.transport = transport; self.vault = vault
        do {ledger = try vault.load(); try ledger.validate()}
        catch {storageBlocked = true; self.error = "Lagret spilleradgang kunne ikke leses. Originaldataene er bevart og blir ikke overskrevet."}
    }
    var entry: OnlineEntry? {ledger.entries.first {$0.id == selected}}
    private func persist(_ next: OnlineLedger) throws {guard !storageBlocked else {throw OnlineFailure.storage}; try vault.save(next); ledger = next}
    private func changeEntry(_ id: UUID, _ update: (inout OnlineEntry) -> Void) throws {
        var next = ledger; guard let i = next.entries.firstIndex(where:{$0.id == id}) else {throw OnlineFailure.storage}; update(&next.entries[i]); try persist(next)
    }
    static func token() throws -> String {
        var bytes = [UInt8](repeating:0,count:32)
        guard SecRandomCopyBytes(kSecRandomDefault,bytes.count,&bytes) == errSecSuccess else {throw OnlineFailure.storage}
        return bytes.map {String(format:"%02x",$0)}.joined()
    }
    static func name(_ input: String) throws -> String {
        let name = input.split(whereSeparator:{$0.isWhitespace}).joined(separator:" ")
        let forbidden = CharacterSet.controlCharacters.union(CharacterSet(charactersIn:"\u{202a}\u{202b}\u{202c}\u{202d}\u{202e}\u{2066}\u{2067}\u{2068}\u{2069}"))
        guard !name.isEmpty, name.count <= 20, name.rangeOfCharacter(from:forbidden) == nil else {throw OnlineFailure.message("Bruk et kallenavn på 1–20 tegn.")}; return name
    }
    func begin(name: String, category: String? = nil, level: Int? = nil, code: String? = nil) async {
        guard !busy else {return}
        do {
            let name = try Self.name(name)
            let normalized = code?.uppercased().filter {!$0.isWhitespace && $0 != "-"}
            if let normalized {guard normalized.range(of:"^[A-HJ-NP-Z2-9]{8}$",options:.regularExpression) != nil else {throw OnlineFailure.message("Skriv romkoden med åtte tegn.")}}
            else {guard let category, ["mix","world","nature","culture","sport","science"].contains(category), let level, (0...2).contains(level) else {throw OnlineFailure.invalidResponse}}
            let pending = PendingOnlineAction(action:code == nil ? "create":"join",name:name,category:category,level:level,code:normalized)
            let e = OnlineEntry(id:UUID(),token:try Self.token(),name:name,createdAt:Date(),roomID:nil,code:normalized,pendingAction:pending)
            var next = ledger; next.entries.insert(e,at:0); try persist(next)
            selected = e.id; room = nil; await retryPending()
        } catch {show(error)}
    }
    func resume(_ id: UUID) async {
        guard !busy, ledger.entries.contains(where:{$0.id == id}) else {return}
        selected = id; room = nil; error = nil
        if entry?.roomID == nil {await retryPending()} else {await refresh()}
    }
    func leave() {selected = nil; room = nil; error = nil}
    func retryPending() async {
        guard !busy, let e = entry, let p = e.pendingAction else {return}
        var payload: [String:Any] = ["name":p.name,"token":e.token]
        if p.action == "create" {payload["category"] = p.category; payload["level"] = p.level} else {payload["code"] = p.code}
        await send(path:p.action == "create" ? "/api/rooms":"/api/rooms/join",body:try? JSONSerialization.data(withJSONObject:payload,options:.sortedKeys),token:nil,entryID:e.id)
    }
    func refresh() async {guard !busy, let e = entry, let id = e.roomID else {return}; await send(path:"/api/rooms/"+id,body:nil,token:e.token,entryID:e.id)}
    func answer(_ choice: Int) async {
        guard !busy, let e = entry, let room, !room.terminal, let q = room.question, room.ownAnswer == nil, e.pendingAnswer == nil, (0...3).contains(choice) else {return}
        do {try changeEntry(e.id) {$0.pendingAnswer = PendingOnlineAnswer(index:q.index,choice:choice)}; await retryAnswer()}
        catch {show(OnlineFailure.storage)}
    }
    func retryAnswer() async {
        guard !busy, let e = entry, let id = e.roomID, let answer = e.pendingAnswer else {return}
        await send(path:"/api/rooms/\(id)/answer",body:try? JSONEncoder().encode(answer),token:e.token,entryID:e.id)
    }
    func cancel() async {guard !busy, let e = entry, let id = e.roomID, room?.terminal == false else {return}; await send(path:"/api/rooms/\(id)/cancel",body:Data("{}".utf8),token:e.token,entryID:e.id)}
    func acknowledge() {
        guard let e = entry, let room, e.reviewed < room.completed else {return}
        do {try changeEntry(e.id) {$0.reviewed += 1}; error = nil} catch {show(OnlineFailure.storage)}
    }
    private func send(path: String, body: Data?, token: String?, entryID: UUID) async {
        busy = true; error = nil; defer {busy = false}
        do {
            let next = try OnlineRoom.decode(await transport.request(path:path,body:body,token:token))
            guard let existing = ledger.entries.first(where:{$0.id == entryID}), existing.roomID == nil || existing.roomID == next.id else {throw OnlineFailure.invalidResponse}
            if selected == entryID, let current = room, next.revision < current.revision {return}
            // Persist acceptance first. If this fails the original pending action/answer is retryable.
            try changeEntry(entryID) {
                $0.roomID = next.id; $0.code = next.code; $0.pendingAction = nil; $0.reviewed = min($0.reviewed,next.completed)
                if let answer = $0.pendingAnswer, next.submitted > answer.index {$0.pendingAnswer = nil}
            }
            if selected == entryID {room = next}; needsLogin = false
        } catch {show(error)}
    }
    private func show(_ error: Error) {
        if case OnlineFailure.login = error {needsLogin = true}
        self.error = (error as? LocalizedError)?.errorDescription ?? OnlineFailure.storage.errorDescription
    }
}
