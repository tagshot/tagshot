# encoding: UTF-8

FactoryGirl.define do
  
  factory :photo do
    association :source
    association :photo_data
    
    file Rails.root.join(*%w[spec resources image.jpg])
    last_sync_at { Time.zone.now }
    file_mtime   { Time.zone.now - 2.minutes }
    size 1024*1024*5
  end

  factory :photo_data do
    sequence(:date) { |n| Date.new(2011, 12, 30) + n.days + n.hours + n.seconds }
    caption 'Caption'
    description 'Description'
    location 'Here'
    sequence(:rating)  { |n| n % 6 }
  end
  
  factory :photo_with_tags, :parent => :photo do
    after_create do |p|
      [:a, :b, :c].map(&:to_s).each do |t|
        Tag.find_or_create_by_name(t).photos << p
      end
    end
  end
  
  factory :photo_with_more_tags, :parent => :photo do
    after_create do |p|
      [:a, :b, :c, :d, :e].map(&:to_s).each do |t|
        Tag.find_or_create_by_name(t).photos << p
      end
    end
  end
  
  factory :photo_with_f_tags, :parent => :photo do
    after_create do |p|
      [:a, :b, :f].map(&:to_s).each do |t|
        Tag.find_or_create_by_name(t).photos << p
      end
    end
  end

  factory :photo_with_g_tags, :parent => :photo do
    after_create do |p|
      [:a, :d, :g].map(&:to_s).each do |t|
        Tag.find_or_create_by_name(t).photos << p
      end
    end
  end

  factory :photo_with_properties, :parent => :photo do
    after_create do |p|
      {'Meta1' => 'Value1', 'Meta2' => 'Value2'}.each do |key, value|
        Property.create!(:name => key, :value => value, :photo_id => p.id)
      end
    end
  end
  
  factory :tag do
    sequence(:name) { |n| "tag#{n}" }
  end
  
  factory :source do
    sequence(:path) { |n| "path/nr/#{n}" }
    sequence(:name) { |n| "Photo Source ##{n}" }
    sequence(:year) { |n| 2010 + n % 3 }
  end
  
  factory :property do
    association :photo
    sequence(:name)  { |n| "Tgst.spec.prop#{n}" }
    sequence(:value) { |n| "value#{n}" }
  end
  
  factory :user do
    sequence(:login) { |n| "user#{n}" }
  end
end
