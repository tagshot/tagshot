module Tagshot
  module VERSION
    MAJOR = 0
    MINOR = 1
    PATCH = nil
    BUILD = 'alpha'
    LEVEL = 6
    
    def self.to_s
      [MAJOR, MINOR, PATCH, BUILD, LEVEL].select{|p| not p.nil?}.join('.')
    end
  end
end
