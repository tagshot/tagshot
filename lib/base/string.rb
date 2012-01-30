class String
  def from_fs_encoding
    if Tagshot::Application.config.forced_fs_encoding.present?
      return self.force_encoding(Tagshot::Application.config.forced_fs_encoding).encode('UTF-8')
    else
      return self
    end
  end

  def to_fs_encoding
    if Tagshot::Application.config.forced_fs_encoding.present?
      return self.encode(Tagshot::Application.config.forced_fs_encoding).force_encoding('UTF-8')
    else
      return self
    end
  end
end
