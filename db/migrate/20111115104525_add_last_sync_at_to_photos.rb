class AddLastSyncAtToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :last_sync_at, :datetime
    add_column :photos, :file_mtime, :datetime
  end
end
