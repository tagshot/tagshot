module Tagshot
  module MetaProperties
    module ClassMethods
      def meta_property(name, *attrs)
        return nil unless attrs.any?
        
        @meta_property_names ||= []
        return false if @meta_property_names.include?(name)
        
        opts = attrs.last.is_a?(Hash) ? attrs.pop : {}
        
        send :define_method, name do
          meta_property_get(attrs, opts)
        end
        
        send :define_method, "#{name}=" do |value|
          meta_property_set(attrs, value, opts)
        end
        
        @meta_property_names << name
      end
      
      def meta_property_names
        @meta_property_names || []
      end
    end
    
    module InstanceMethods
      def meta_property_get(attrs, opts)
        attrs.each do |key|
          values = self.properties.select{|p|p.name == key}.map(&:value)
          next if values.empty?
          
          values = values.map{|i| meta_convert_value(i, opts)}
          return values.length == 1 ? values.first : values
        end
        opts[:default]
      end
      
      def meta_convert_value(value, opts)
        return opts[:do].call value if opts[:do].is_a?(Proc)
        return value.send opts[:do] if opts[:do].is_a?(Symbol)
        value || opts[:default]
      rescue
        value || opts[:default]
      end
      
      def meta_property_set(attrs, value, opts)
        attrs.each do |key|
          value = [value] unless value.is_a?(Array)
          
          self.properties.where(:name => key).destroy
          
          value.each do |val|
            self.properties.create :name => key, :value => al
          end
        end
        self.update_attributes :updated_at => Time.zone.now
      end
    end
  
    def self.included(receiver)
      receiver.extend         ClassMethods
      receiver.send :include, InstanceMethods
    end
  end
end
