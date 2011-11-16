# encoding: UTF-8

FactoryGirl.define do
  
  factory :photo do
    association :source
    
    sequence(:file) { |n| "image#{n}.jpg" }
    last_sync_at { Time.zone.now }
    file_mtime  { Time.zone.now - 2.minutes }
    size 1024*1024*5
  end
  
  factory :source do
    sequence(:path) { |n| "path/nr/#{n}" }
    sequence(:name) { |n| "Photo Source ##{n}" }
  end
end
