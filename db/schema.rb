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

ActiveRecord::Schema.define(:version => 20120125201403) do

  create_table "auth_sources", :force => true do |t|
    t.string   "type"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "photo_data", :force => true do |t|
    t.integer  "photo_id"
    t.datetime "date"
    t.string   "owner"
    t.string   "creator"
    t.integer  "aperture_denominator",     :limit => 2
    t.integer  "aperture_numerator",       :limit => 2
    t.integer  "exposureTime_denominator", :limit => 2
    t.integer  "exposureTime_numerator",   :limit => 2
    t.string   "lens"
    t.integer  "isoSpeedRating"
    t.string   "exposureMode"
    t.datetime "created_at",                            :null => false
    t.datetime "updated_at",                            :null => false
    t.string   "caption"
    t.integer  "rating"
    t.string   "location"
    t.string   "description"
  end

  create_table "photos", :force => true do |t|
    t.string   "file"
    t.integer  "size"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "source_id"
    t.datetime "last_sync_at"
    t.datetime "file_mtime"
  end

  add_index "photos", ["file", "source_id"], :name => "index_photos_on_file_and_source_id", :unique => true
  add_index "photos", ["file"], :name => "index_photos_on_file"

  create_table "photos_tags", :force => true do |t|
    t.integer "photo_id", :null => false
    t.integer "tag_id",   :null => false
  end

  add_index "photos_tags", ["photo_id", "tag_id"], :name => "index_photos_tags_on_photo_id_and_tag_id", :unique => true

  create_table "properties", :force => true do |t|
    t.integer "photo_id"
    t.string  "name"
    t.string  "value"
  end

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

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "password"
    t.integer  "auth_source_id"
    t.boolean  "admin",          :default => false
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
