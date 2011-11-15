# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111114190319) do

  create_table "keys", :force => true do |t|
    t.string "name"
  end

  add_index "keys", ["name"], :name => "index_keys_on_name", :unique => true

  create_table "photos", :force => true do |t|
    t.string   "file"
    t.integer  "size"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "source_id"
  end

  add_index "photos", ["file", "source_id"], :name => "index_photos_on_file_and_source_id", :unique => true
  add_index "photos", ["file"], :name => "index_photos_on_file"

  create_table "photos_tags", :force => true do |t|
    t.integer "photo_id", :null => false
    t.integer "tag_id",   :null => false
  end

  add_index "photos_tags", ["photo_id", "tag_id"], :name => "index_photos_tags_on_photo_id_and_tag_id", :unique => true

  create_table "properties", :force => true do |t|
    t.integer  "photo_id"
    t.integer  "key_id"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "properties", ["photo_id", "key_id"], :name => "index_properties_on_photo_id_and_key_id", :unique => true

  create_table "sources", :force => true do |t|
    t.string   "path"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  add_index "tags", ["name"], :name => "index_tags_on_name", :unique => true

end
