# encoding: UTF-8

require 'base/string'
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
      entry = entry.from_fs_encoding
      next if entry =~ /\.\.?/
      nextpath = File.join(path, entry)
      next unless FileTest.directory? nextpath.to_fs_encoding
      index!(nextpath, level+1)
    end
  end

  def self.version
    Tagshot::VERSION.to_s
  end
end
