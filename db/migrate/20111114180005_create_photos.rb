class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :file
      t.string :checksum
      t.integer :size

      t.timestamps
    end
  end
end
