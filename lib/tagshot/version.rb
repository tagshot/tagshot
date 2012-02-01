module Tagshot
  module VERSION
    MAJOR = 0
    MINOR = 1
    PATCH = 2
    BUILD = nil
    LEVEL = nil
    
    def self.to_s
      [MAJOR, MINOR, PATCH, BUILD, LEVEL].select{|p| not p.nil?}.join('.')
    end
  end
end
