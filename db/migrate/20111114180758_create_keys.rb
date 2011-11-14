class CreateKeys < ActiveRecord::Migration
  def change
    create_table :keys do |t|
      t.string :name
    end
    
    add_index :keys, :name, :unique => true
  end
end
