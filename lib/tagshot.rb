
require 'tagshot/image'
require 'tagshot/syncronizer'
require 'tagshot/version'

require 'tagshot/photo/tag_helper'
require 'tagshot/photo/property_helper'

module Tagshot
  
  def self.sync_all!
    Source.all.each do |source|
      Tagshot::Syncronizer.new(source).sync!
    end
  end
  
  def self.read_all!
    Source.all.each do |source|
      Tagshot::Syncronizer.new(source).read!
    end
  end
  
  def self.save_all!
    Source.all.each do |source|
      Tagshot::Syncronizer.new(source).save!
    end
  end
end
