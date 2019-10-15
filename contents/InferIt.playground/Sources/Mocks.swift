import Foundation

public typealias Path = String

public extension String {
  static var current: String {
    return FileManager.default.currentDirectoryPath
  }
}
