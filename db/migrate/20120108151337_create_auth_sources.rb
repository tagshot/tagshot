class CreateAuthSources < ActiveRecord::Migration
  def change
    create_table :auth_sources do |t|
      t.string :type
      t.integer :position, :unique => true

      t.timestamps
    end
  end
end
