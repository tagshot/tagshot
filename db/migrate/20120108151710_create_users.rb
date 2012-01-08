class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login, :unique => true
      t.string :password
      t.integer :auth_source_id
      t.boolean :admin, :default => false
      t.string :type

      t.timestamps
    end
  end
end
