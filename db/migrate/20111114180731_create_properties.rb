class CreateProperties < ActiveRecord::Migration
  def change
    create_table :properties do |t|
      t.integer :photo_id
      t.integer :key_id
      t.string :value

      t.timestamps
    end
    
    add_index :properties, [:photo_id, :key_id], :unique => true
  end
end
