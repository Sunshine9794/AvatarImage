require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'hecom-rn-avatar-image'
  s.version      = package['version']
  s.summary      = package['description']
  s.authors      = { "VampireGod" => "mashuai_hy@163.com" }
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/hecom-rn/AvatarImage.git" }
  s.source_files = 'ios/**/*.{h,m}'
  s.dependency 'React'
end