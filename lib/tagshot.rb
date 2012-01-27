
require 'base/file'
require 'tagshot/image'
require 'tagshot/syncronizer'
require 'tagshot/image_syncronizer'
require 'tagshot/tag_helper'
require 'tagshot/meta_properties'
require 'tagshot/version'
require 'tagshot/search_parser'

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
end
