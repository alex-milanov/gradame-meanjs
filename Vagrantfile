# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.provision :shell, :path => "bootstrap_vagrant.sh", :privileged => false

  config.vm.synced_folder ".", "/vagrant", :nfs => true
  config.vm.network :private_network, ip: "10.3.3.3"
  config.vm.network :forwarded_port, host: 8888, guest: 3000
end
