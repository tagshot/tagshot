class Photo < ActiveRecord::Base
  belongs_to :source
  has_one :photo_data

  validates_presence_of :file, :size
  validates_uniqueness_of :file, :scope => :source_id

  has_many :properties do
    def to_hash
      hash = {}
      each do |p|
        if hash[p.name].nil?
          hash[p.name] = p.value
        elsif hash[p.name].is_a?(Array)
          hash[p.name] << p.value
        else
          hash[p.name] = [hash[p.name], p.value]
        end
      end
      hash
    end
    def +(props)
      props = props.to_a.map {|k,v| create!(:name => k, :value => v) } if props.is_a?(Hash)
      super props
    end
    def delete(*props)
      ps = []
      props.each do |prop|
        ps << prop and next if prop.is_a?(Property)
        ps += self.where(:name => prop.to_s).to_a
      end
      super ps
    end
  end

  has_and_belongs_to_many :tags, :uniq => true do
    def <<(tag)
      tag = Tag.find_or_create_by_name(tag.to_s) unless tag.is_a?(Tag)
      super tag
    rescue
    end

    def names
      map(&:name)
    end

    def -(tags)
      tags.map! { |tag| tag.is_a?(Tag) ? tag : Tag.find_by_name(tag) }
      tags = tags.select(&:present?)
      super tags
    end

    def delete(tag)
      tag = tag.is_a?(Tag) ? tag : Tag.find_by_name(tag)
      super tag
    end
  end

  def tag_names; tags.names end
  def tags=(tags)
    tags = [tags] unless tags.respond_to? :each
    self.tags.delete_all
    tags.each { |tag| self.tags << tag if tag.present? }
  end

  def file=(file); write_attribute(:file, file.to_s.strip) end
  def file; read_attribute(:file).try :strip end

  def data
    data = self.photo_data || PhotoData.new(photo_id: id)
    data.load_meta_properties.save! if data.new_record?
    data
  end

  def extname
    @extname ||= File.extname(file).gsub(/\./, '')
  end

  def thumb
    @thumb ||= Thumb.new(self)
  end
end

