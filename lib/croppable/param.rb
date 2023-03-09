module Croppable
  class Param
    attr_accessor :image, :data, :host, :delete

    def initialize(image, data, host:, delete: false)
      @image = image
      @delete = delete
      @host = host
      @data  = {
        x:                data[:x],
        y:                data[:y],
        scale:            data[:scale],
        background_color: data[:background_color]
      }
    end
  end
end
