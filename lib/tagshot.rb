
require 'base/file'
require 'tagshot/image'
require 'tagshot/syncronizer'
require 'tagshot/image_syncronizer'
require 'tagshot/tag_helper'
require 'tagshot/meta_properties'
require 'tagshot/version'
require 'tagshot/search_parser'

module Tagshot
  
  def self.index!(path=nil, level=0)
    path = Tagshot::Application.config.image_root_path if path.nil?
    puts "index #{path}"
    if level >= Tagshot::Application.config.image_source_level_count
      if not Source.find_by_path(path)
        year = nil
        if path =~ /\/([0-9]{4})\//
          year = $1.to_i
        elsif path =~ /((20|19)[0-9]{2})/
          year = $1.to_i
        end
        name = path[Tagshot::Application.config.image_root_path.length..-1]
        Source.create :path => path, :name => name, :year => year
      end
      return
    end

    Dir.new(path).each do |entry|
      next if entry =~ /\.\.?/
      nextpath = File.join(path, entry)
      next unless FileTest.directory? nextpath
      index!(nextpath, level+1)
    end
  end

  def self.sync_all!
    Source.all.each do |source|
      puts "sync source #{source.path}"
      Tagshot::Syncronizer.new(source).sync!
    end
  end
  
  def self.read_all!
    Source.all.each do |source|
      puts "read source #{source.path}"
      Tagshot::Syncronizer.new(source).read!
    end
  end

  def self.version
    Tagshot::VERSION.to_s
  end
end
