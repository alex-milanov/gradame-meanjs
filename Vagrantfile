# -*- mode: ruby -*-
# vi: set ft=ruby :
require 'rbconfig'

is_windows = (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.provision :shell, :path => "bootstrap_vagrant.sh", :privileged => false

  fs_type = is_windows ? "smb" : "nfs"
  config.vm.synced_folder ".", "/vagrant", type: fs_type

  config.vm.network :private_network, ip: "10.3.3.3"
end
