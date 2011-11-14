class AddSourceIdToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :source_id, :integer
  end
end
