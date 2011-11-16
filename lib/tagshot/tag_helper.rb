module Tagshot
  module TagHelper
    module InstanceMethods
      def tags_with_helper
        @tag_helper_list ||= TagList.new self
        @tag_helper_list
      end
      
      def tags=(tags)
        tags_with_helper.delete_all
        tags_with_helper.each { |t| tags << t }
      end
    end
  
    def self.included(receiver)
      receiver.send :include, InstanceMethods
      receiver.alias_method_chain :tags, :helper
    end
    
    class TagList
      include Enumerable
      
      def initialize(photo)
        @photo = photo
      end
      
      def <<(tag)
        @photo.tags_without_helper << Tag.find_or_create_by_name(tag.to_s)
        true
      rescue
        false
      end
      
      def +(tags)
        to_a + tags
      end
      
      def -(tags)
        to_a - tags
      end
      
      def delete(tag)
        tag = Tag.find_by_name(tag.to_s)
        @photo.tags_without_helper.delete(tag) if tag
      end
      alias_method :remove, :delete
      
      def delete_all
        @photo.tags_without_helper.delete_all
      end
      
      def each(&block)
        @photo.to_a.each { |t| block.call(t.name) }
      end
      
      def to_a
        @photo.tags_without_helper.map(&:name).select(&:present?)
      end
    end
  end
end
