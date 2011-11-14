module Tagshot
  module VERSION
    MAJOR = 0
    MINOR = 1
    PATCH = 0
    BUILD = 'dev'
    LEVEL = 1
    
    def to_s
      [MAJOR, MINOR, PATCH, BUILD, LEVEL].join('.')
    end
  end
end
