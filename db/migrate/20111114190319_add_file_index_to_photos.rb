class AddFileIndexToPhotos < ActiveRecord::Migration
  def change
    add_index :photos, :file
    add_index :photos, [:file, :source_id], :unique => true
  end
end
