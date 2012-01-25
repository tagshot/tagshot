module Tagshot
  module MetaProperties
    module ClassMethods
      # Defines a new meta property. The meta property must be an attribute of
      # the model. After there must be a list of properties where the meta
      # property will be read from and written to.
      def meta_property(name, *attrs)
        return nil unless attrs.any?
        before_save :save_meta_properties

        options = attrs.extract_options!
        meta_properties[name.to_sym] = {
          properties: attrs,
          options: options
        }
      end

      # Returns all defined meta properties along there property mappings and
      # options.
      def meta_properties
        @meta_properties ||= {}
      end

      def meta_property_names
        @meta_properties.keys
      end
    end
    
    module InstanceMethods

      def save_meta_properties
        # remove all properties that will be written to avoid doubles
        properties = self.class.meta_properties.map{|name, attrs| attrs[:properties]}.flatten.uniq
        self.photo.properties.where(name: properties).destroy_all

        self.photo.properties + self.class.meta_properties.map do |name, attrs|
          properties, options = attrs[:properties], attrs[:options]
          properties.map do |property|
            value = self.send name
            value = options[:default] unless value
            value = value.send options[:process] if options[:process].is_a?(Symbol)

            Property.new(photo: self.photo, name: property, value: value)
          end
        end.flatten
      end

      def load_meta_properties
        self.class.meta_properties.each do |name, attrs|
          properties, options = attrs[:properties], attrs[:options]
          value = load_meta_property_from properties, options[:default]
          value = value.send options[:process] if options[:process].is_a?(Symbol)
          send :"#{name}=", value
        end
        self
      end

      private
      def load_meta_property_from(properties, default)
        properties.each do |property|
          value = self.photo.properties.limit(1).where(name: property).first.try :value
          return value if value
        end
        default
      end
    end
    
    def self.included(receiver) # :nodoc:
      receiver.extend         ClassMethods
      receiver.send :include, InstanceMethods
    end
  end
end
