class MergeKeysInProperties < ActiveRecord::Migration
  def up
    drop_table :keys
    drop_table :properties
    
    create_table :properties do |t|
      t.integer :photo_id
      t.string :name
      t.string :value
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "Can't recover deleted keys"
  end
end
