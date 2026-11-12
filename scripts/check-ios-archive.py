#!/usr/bin/env python3
"""Read-only offline-beta archive checks; does not upload or grant approval."""
import argparse
import hashlib
import json
from pathlib import Path
import plistlib
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('archive', type=Path)
parser.add_argument('--build', default='6')
args = parser.parse_args()
archive = args.archive.resolve()
def require(condition, message):
    if not condition:
        raise SystemExit('FAIL: ' + message)
meta = plistlib.loads((archive / 'Info.plist').read_bytes())
app = archive / 'Products' / meta['ApplicationProperties']['ApplicationPath']
info = plistlib.loads((app / 'Info.plist').read_bytes())
require(info['CFBundleIdentifier'] == 'no.quizkrutt.ios', 'unexpected bundle ID')
require(info['CFBundleShortVersionString'] == '0.5.0' and info['CFBundleVersion'] == args.build, 'unexpected version')
require(info['CFBundleSupportedPlatforms'] == ['iPhoneOS'], 'archive is not for a real iOS device')
require(set(info['UIDeviceFamily']) == {1, 2}, 'iPhone and iPad must both be supported')
require(info.get('ITSAppUsesNonExemptEncryption') is False, 'export compliance flag missing')
require(not info.get('NSAppTransportSecurity', {}).get('NSAllowsArbitraryLoads', False), 'arbitrary transport loads enabled')
require(len(info['UISupportedInterfaceOrientations~ipad']) == 4, 'all iPad orientations required')
privacy = plistlib.loads((app / 'PrivacyInfo.xcprivacy').read_bytes())
require(privacy['NSPrivacyTracking'] is False, 'tracking enabled')
require(privacy['NSPrivacyCollectedDataTypes'] == [], 'offline beta must not declare active online collection')
require(any(p['NSPrivacyAccessedAPIType'] == 'NSPrivacyAccessedAPICategoryUserDefaults' and 'CA92.1' in p['NSPrivacyAccessedAPITypeReasons'] for p in privacy['NSPrivacyAccessedAPITypes']), 'UserDefaults reason missing')
# Xcode may flatten synchronized resource directories; find each unique resource.
def resource(name):
    paths = list(app.rglob(name))
    require(len(paths) == 1, 'missing or duplicate resource: ' + name)
    return paths[0]
bank = json.loads(resource('questions.json').read_text())
require(len(bank['questions']) == 540 and len(bank['categories']) == 6, 'question bank count mismatch')
catalog = json.loads(resource('pack-catalog.json').read_text())
require(len(catalog) == 6 and sum(p['count'] for p in catalog) == 120, 'pack catalog count mismatch')
for pack in catalog:
    data = resource(Path(pack['file']).name).read_bytes()
    require(len(data) == pack['bytes'] and hashlib.sha256(data).hexdigest() == pack['sha256'], 'pack integrity failed: ' + pack['id'])
require(bool(info.get('CFBundleIcons')), 'compiled app icon missing')
require((archive / 'dSYMs' / 'Quizkrutt.app.dSYM').is_dir(), 'debug symbols missing')
identity = meta['ApplicationProperties'].get('SigningIdentity', '')
if identity:
    subprocess.run(['codesign', '--verify', '--deep', '--strict', str(app)], check=True)
print(json.dumps({'result': 'PASS', 'version': '0.5.0 (' + args.build + ')', 'platform': 'iPhoneOS', 'questions': 540, 'pack_questions': 120, 'signed': bool(identity), 'distribution_signed': identity.startswith('Apple Distribution'), 'apple_upload_validated': False}, indent=2))
print('Local checks only. App Store Connect validation, public URLs and final QA remain required.')
