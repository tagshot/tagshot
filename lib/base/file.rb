module Tagshot::FileExtension
  
    def self.included(base) # :nodoc:
      base.alias_method_chain :path, :enc
    end
    
    def path_with_enc
      path = path_without_enc
      if path.respond_to? :encoding
        path = path.force_encoding('UTF-8') unless path.encoding.to_s == 'UTF-8'
      end
      path
    end
end

File.send :include, Tagshot::FileExtension
