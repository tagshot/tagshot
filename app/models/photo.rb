class Photo < ActiveRecord::Base
  include Tagshot::MetaProperties
  
  meta_property :caption, 'Xmp.dc.title', 'Iptc.Application2.Headline'
  meta_property :description, 'Xmp.dc.description', 'Iptc.Application2.Caption', 'Exif.Photo.UserComment'
  meta_property :rating, 'Iptc.Application2.Urgency', :default => 0, :do => :to_i
  meta_property :location, 'Xmp.iptc.Location', 'Iptc.Application2.LocationName'
  
  belongs_to :source
  
  
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
      tags.select!(&:present?)
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
  def file; read_attribute(:file).strip end
    
  def extname
    @extname ||= File.extname(file).gsub(/\./, '')
  end
  
  def thumb(opts = {})
    file
  end
end
