class AddIndeciesToProperties < ActiveRecord::Migration
  def change
  	add_index :properties, :name
  	add_index :properties, [:photo_id, :name]
  end
end
