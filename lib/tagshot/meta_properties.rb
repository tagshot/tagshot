module Tagshot
  module MetaProperties
    module ClassMethods
      # Defines a new meta property. The meta property must be an attribute of
      # the model. After there must be a list of properties where the meta
      # property will be read from and written to.
      def meta_property(name, *attrs)
        return nil unless attrs.any?
        before_save :save_meta_properties
        after_initialize :setup_meta_defaults

        meta_properties[name.to_sym] = {
          options: attrs.extract_options!,
          properties: attrs
        }
      end

      # Returns all defined meta properties along there property mappings and
      # options.
      def meta_properties
        @meta_properties ||= {}
      end

      def meta_property_names(options)
        meta_properties.select do |key, value|
          meta_property_name_match value, options
        end.keys
      end

      private
      def meta_property_name_match(value, options)
        return false if options[:readonly] and not value[:options][:readonly]
        return false if not options[:readonly] and value[:options][:readonly]
        return true
      end
    end
    
    module InstanceMethods

      def save_meta_properties
        return unless self.photo # ensure we've a photo association

        # remove all properties that will be written to avoid doubles
        properties = self.class.meta_properties.map{|name, attrs| attrs[:properties]}.flatten.uniq
        self.photo.properties.where(name: properties).destroy_all

        self.photo.properties + self.class.meta_properties.map do |name, attrs|
          properties, options = attrs[:properties], attrs[:options]
          properties.map do |property|
            value = self.send name
            value = options[:default] unless value
            value = value.send options[:process] if options[:process].is_a?(Symbol)

            # puts ">> Save meta property #{name} as #{property} => #{value.inspect}"
            Property.new(photo: self.photo, name: property, value: value)
          end
        end.flatten
      end

      def load_meta_properties
        return unless self.photo # ensure we've a photo association

        self.class.meta_properties.each do |name, attrs|
          properties, options = attrs[:properties], attrs[:options]
          value = load_meta_property_from properties, options[:default]
          value = value.send options[:process] if options[:process].is_a?(Symbol)
          send :"#{name}=", value
        end
        self
      end

      def setup_meta_defaults
        self.class.meta_properties.each do |name, attrs|
          properties, options = attrs[:properties], attrs[:options]
          value = self.send name
          send :"#{name}=", attrs[:options][:default] unless value
        end
      end

      def meta_properties(options = {})
        Hash[self.class.meta_property_names(options).map do |name|
          [name.to_sym, send(name.to_sym)]
        end]
      end

      def update_meta_properties!(attrs)
        properties = self.class.meta_property_names(readonly: false)
        update_attributes! attrs.select{|key, value| properties.include? key}
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
