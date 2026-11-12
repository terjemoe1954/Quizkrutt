import XCTest
import CryptoKit
@testable import QuizkruttEngine

final class I2Tests: XCTestCase {
    var resources: URL {URL(fileURLWithPath:#filePath).deletingLastPathComponent().deletingLastPathComponent().appending(path:"Quizkrutt/Resources")}
    func catalog() throws -> [PackEntry] {try JSONDecoder().decode([PackEntry].self,from:Data(contentsOf:resources.appending(path:"pack-catalog.json")))}
    func payload(_ entry: PackEntry) throws -> Data {try Data(contentsOf:resources.appending(path:URL(fileURLWithPath:entry.file).lastPathComponent))}
    func bank() throws -> QuestionBank {try JSONDecoder().decode(QuestionBank.self,from:Data(contentsOf:resources.appending(path:"questions.json")))}
    func testAllSixPackChecksumsAnd120UniqueQuestions() throws {
        let entries = try catalog(); XCTAssertEqual(entries.count,6)
        var ids = Set<String>()
        for entry in entries {let p = try validatePack(payload(entry),entry:entry); XCTAssertEqual(p.questions.count,20); ids.formUnion(p.questions.map(\.id))}
        XCTAssertEqual(ids.count,120)
    }
    func testInvalidPackLeavesPreviousContentUnchanged() throws {
        let entry = try XCTUnwrap(catalog().first); let data = try payload(entry)
        var l = PackLibrary(); try l.install(data,entry:entry)
        var damaged = data; damaged[0] = 0
        XCTAssertThrowsError(try l.install(damaged,entry:entry))
        XCTAssertEqual(l.installed[entry.id]?.data,data)
        XCTAssertThrowsError(try l.install(Data(data.dropLast()),entry:entry))
        // Valid transport hash but altered identity/schema/options must also fail.
        for field in ["schema","id","questions"] {
            var json = try XCTUnwrap(JSONSerialization.jsonObject(with:data) as? [String:Any])
            if field == "schema" {json[field] = 99}
            if field == "id" {json[field] = "wrong-id"}
            if field == "questions" {json[field] = []}
            let changed = try JSONSerialization.data(withJSONObject:json)
            let e = PackEntry(id:entry.id,version:entry.version,title:entry.title,description:entry.description,category:entry.category,level:entry.level,count:entry.count,bytes:changed.count,sha256:SHA256.hash(data:changed).map {String(format:"%02x",$0)}.joined(),file:entry.file)
            XCTAssertThrowsError(try validatePack(changed,entry:e))
        }
    }
    func testPackPlayRotationScoringAndResume() throws {
        let entry = try XCTUnwrap(catalog().first); var l = PackLibrary(); try l.install(payload(entry),entry:entry)
        var ids = Set<String>()
        for _ in 0..<2 {
            try l.start(entry.id); ids.formUnion(try XCTUnwrap(l.active).cards.map {$0.question.id})
            XCTAssertThrowsError(try l.start(entry.id))
            for _ in 0..<10 {
                let a = try XCTUnwrap(l.active)
                XCTAssertTrue(l.answer(a.cards[a.index].correct)); XCTAssertFalse(l.answer(0)); XCTAssertFalse(l.answer(4))
                l = try JSONDecoder().decode(PackLibrary.self,from:JSONEncoder().encode(l)); try l.validate()
                let result = l.advance(); if a.index == 9 {XCTAssertEqual(result,1000)} else {XCTAssertNil(result)}
            }
        }
        XCTAssertEqual(ids.count,20); XCTAssertEqual(l.history[entry.key]?.best,1000); XCTAssertEqual(l.history[entry.key]?.rounds,2)
        XCTAssertNil(l.advance()); XCTAssertEqual(l.history[entry.key]?.rounds,2)
    }
    func testRemovalKeepsActiveSnapshotAndResults() throws {
        let entry = try XCTUnwrap(catalog().first); var l = PackLibrary(); let data = try payload(entry)
        try l.install(data,entry:entry); try l.start(entry.id); l.remove(entry.id)
        l = try JSONDecoder().decode(PackLibrary.self,from:JSONEncoder().encode(l)); try l.validate()
        for _ in 0..<10 {let a = try XCTUnwrap(l.active); XCTAssertTrue(l.answer(a.cards[a.index].correct)); _ = l.advance()}
        XCTAssertNil(l.installed[entry.id]); XCTAssertEqual(l.history[entry.key]?.best,1000)
        try l.install(data,entry:entry); XCTAssertEqual(l.history[entry.key]?.best,1000)
    }
    func testDiskPersistenceIsolationAndCorruptFileProtection() throws {
        let folder = FileManager.default.temporaryDirectory.appending(path:UUID().uuidString)
        defer {try? FileManager.default.removeItem(at:folder)}
        let disk = PackDisk(file:folder.appending(path:"packs-v1.json"))
        var l = try disk.load(); let e = try XCTUnwrap(catalog().first)
        try l.install(payload(e),entry:e); try l.start(e.id); XCTAssertTrue(l.answer(0)); try disk.save(l)
        let oldSolo = Data("unchanged I1 progress".utf8), solo = folder.appending(path:"progress-v1.json")
        try oldSolo.write(to:solo)
        let loaded = try disk.load(); XCTAssertEqual(loaded.active?.answers,[0])
        l.remove(e.id); try disk.save(l); XCTAssertEqual(try Data(contentsOf:solo),oldSolo)
        let corrupt = Data("invalid pack state".utf8); try corrupt.write(to:disk.file)
        XCTAssertThrowsError(try disk.load()); XCTAssertEqual(try Data(contentsOf:disk.file),corrupt)
        let impossible = PackDisk(file:solo.appending(path:"child.json"))
        XCTAssertThrowsError(try impossible.save(l)); XCTAssertEqual(try Data(contentsOf:solo),oldSolo)
    }
    func testDowngradeAndCorruptActiveSnapshotRejected() throws {
        let e = try XCTUnwrap(catalog().first), data = try payload(e)
        var json = try XCTUnwrap(JSONSerialization.jsonObject(with:data) as? [String:Any]); json["version"] = 2
        let newer = try JSONSerialization.data(withJSONObject:json)
        let e2 = PackEntry(id:e.id,version:2,title:e.title,description:e.description,category:e.category,level:e.level,count:e.count,bytes:newer.count,sha256:SHA256.hash(data:newer).map {String(format:"%02x",$0)}.joined(),file:"packs/\(e.id).v2.json")
        var l = PackLibrary(); try l.install(data,entry:e); try l.start(e.id); try l.install(newer,entry:e2)
        XCTAssertThrowsError(try l.install(data,entry:e)); XCTAssertEqual(l.active?.entry.version,1); XCTAssertEqual(l.installed[e.id]?.entry.version,2)
        try l.validate(); l.active?.answers = [-1]; XCTAssertThrowsError(try l.validate())
    }
    func testBalancedSofaDuelAllSettingsAndHiddenCards() throws {
        let b = try bank()
        for c in b.categories {for level in 0...2 {for count in [5,10] {for first in 0...1 {
            var d = try SofaDuel(names:["Terje","Tester"],category:c.id,level:level,count:count,bank:b,first:first)
            XCTAssertNil(d.visibleCard); XCTAssertEqual(d.player,first)
            XCTAssertFalse(d.answer(0)); d.next(); XCTAssertEqual(d.turn,0)
            let a = Set(d.cards[0].map {$0.question.id}), z = Set(d.cards[1].map {$0.question.id})
            XCTAssertEqual(a.count,count); XCTAssertTrue(a.isDisjoint(with:z))
            func groups(_ cards:[SnapshotCard]) -> [String:Int] {Dictionary(grouping:cards) {$0.question.id.split(separator:"-").dropLast().joined(separator:"-")}.mapValues(\.count)}
            XCTAssertEqual(groups(d.cards[0]),groups(d.cards[1]))
            for turn in 0..<count*2 {
                XCTAssertNil(d.visibleCard); d.reveal(); let q = try XCTUnwrap(d.visibleCard)
                XCTAssertEqual(d.player,(first+turn)%2); XCTAssertEqual(d.index,turn/2)
                XCTAssertTrue(d.answer(q.correct)); XCTAssertFalse(d.answer(q.correct))
                d.hide(); XCTAssertNil(d.visibleCard); d.reveal(); XCTAssertEqual(d.phase,.feedback)
                d.next()
            }
            XCTAssertEqual(d.phase,.finished); XCTAssertNil(d.winner); XCTAssertEqual(d.scores,[count*100,count*100]); XCTAssertNil(d.visibleCard)
            d.next(); XCTAssertEqual(d.turn,count*2)
        }}}}
    }
    func testSofaWinnerAndBackgroundWithoutLosingChoice() throws {
        let b = try bank(); var d = try SofaDuel(names:["A","B"],category:"mix",level:0,count:5,bank:b,first:0)
        d.reveal(); let id = try XCTUnwrap(d.visibleCard).question.id; d.hide(); XCTAssertNil(d.visibleCard); d.reveal(); XCTAssertEqual(d.visibleCard?.question.id,id)
        for _ in 0..<10 {
            d.reveal(); let card = try XCTUnwrap(d.visibleCard)
            _ = d.answer(d.player == 0 ? card.correct:(card.correct+1)%4); d.next()
        }
        XCTAssertEqual(d.winner,0); XCTAssertEqual(d.scores,[500,0])
    }
    func testNamesAndInvalidDuelSettings() throws {
        let b = try bank()
        XCTAssertEqual(try SofaDuel.normalizedNames(["  Terje   Moe ","Tester"]),["Terje Moe","Tester"])
        for names in [["","B"],["Ａ","a"],["Terje","TERJE"],[String(repeating:"a",count:21),"B"],["A\u{202e}","B"]] {
            XCTAssertThrowsError(try SofaDuel(names:names,category:"mix",level:0,count:5,bank:b))
        }
        XCTAssertThrowsError(try SofaDuel(names:["A","B"],category:"unknown",level:0,count:5,bank:b))
        XCTAssertThrowsError(try SofaDuel(names:["A","B"],category:"mix",level:3,count:5,bank:b))
        XCTAssertThrowsError(try SofaDuel(names:["A","B"],category:"mix",level:0,count:6,bank:b))
    }
}
