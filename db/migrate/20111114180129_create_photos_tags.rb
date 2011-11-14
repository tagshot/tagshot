class CreatePhotosTags < ActiveRecord::Migration
  def change
    create_table :photos_tags, :id => :false do |t|
      t.integer :photo_id, :null => false
      t.integer :tag_id,   :null => false
    end
    
    add_index :photos_tags, [:photo_id, :tag_id], :unique => true
  end
end
