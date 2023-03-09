require "croppable/crop"

module Croppable
  class CropImageJob < ApplicationJob
    queue_as :default

    def perform(model, croppable_name, host:)
      Croppable::Crop.new(model, croppable_name, host: host).perform()
    end
  end
end
