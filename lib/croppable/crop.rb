require 'open-uri'
require 'vips'

module Croppable

  class Crop
    def initialize(model, attr_name)
      @model     = model
      @attr_name = attr_name
      @data      = model.send("#{attr_name}_croppable_data")
      @setup     = model.send("#{attr_name}_croppable_setup")
      original   = model.send("#{attr_name}_original")
      @url       = Rails.application.routes.url_helpers.rails_blob_url(original, host: Rails.application.config.asset_host)
    end

    def perform()
      file = URI(@url).open
      vips_img = Vips::Image.new_from_file(file.path)

      height = vips_img.height
      width  = vips_img.width

      x = (width  - (width  * @data.scale)) / 2 + @data.x
      y = (height - (height * @data.scale)) / 2 + @data.y

      background = @data.background_color.remove("#").scan(/\w{2}/).map {|color| color.to_i(16) }
      background_embed = background.dup
      background_embed << 255 if vips_img.bands == 4

      vips_img = vips_img.resize(@data.scale * @setup[:resolution])
      vips_img = vips_img.embed(
        x * @setup[:resolution],
        y * @setup[:resolution],
        @setup[:width] * @setup[:resolution],
        @setup[:height] * @setup[:resolution],
        background: background_embed
      )

      path = Tempfile.new('croped').path + ".jpg"

      vips_img.write_to_file(path, background: background, Q: 100)

      @model.send("#{ @attr_name }_cropped").attach(io: File.open(path), filename: "croped")
    end
  end
end
