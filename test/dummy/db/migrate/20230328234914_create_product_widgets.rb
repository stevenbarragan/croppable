class CreateProductWidgets < ActiveRecord::Migration[7.0]
  def change
    create_table :product_widgets do |t|
      t.string :name
      t.references :product, null: false, foreign_key: true

      t.timestamps
    end
  end
end
