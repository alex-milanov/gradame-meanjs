#!/usr/bin/env bash

VAGRANT_DIR=/vagrant
PROJECT_NAME=gradame
DB_NAME=$PROJECT_NAME

sudo apt-get update -y

# usability (can be omitted)
sudo apt-get update -y
touch $HOME/.hushlogin
sudo apt-get install expect curl zsh fortune cowsay htop git build-essential -y
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh
sudo mkdir -p $HOME/.oh-my-zsh/custom/plugins
git clone git://github.com/zsh-users/zsh-syntax-highlighting.git  $HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
sudo chsh -s `which zsh` vagrant
sed -i 's/^plugins=(.*/plugins=(git django python pip emoji-clock zsh-syntax-highlighting bower)/' $HOME/.zshrc
echo "export LC_ALL=en_US.UTF-8" >> $HOME/.zshrc
echo "export LANG=en_US.UTF-8" >> $HOME/.zshrc

# nodejs
wget -qO- https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh
source $HOME/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10

# bower as frontned package manager
npm install bower -g

#mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update -y
sudo apt-get install mongodb-org -y
npm install pm2@latest -g

# grunt CLI tool so all tasks can be ran in the VM
npm install grunt-cli -g


# backend and frontend dependencies
(cd $VAGRANT_DIR && npm install && bower install)

# setup server service
(cd $VAGRANT_DIR && pm2 start server.js --watch )
pm2 save
sudo env PATH=$PATH:/home/vagrant/.nvm/v0.10.29/bin pm2 startup ubuntu -u vagrant
sudo service pm2-init.sh start

echo "start on vagrant-mounted

script
  service pm2-init.sh start
end script" | sudo tee /etc/init/vagrant-fix.conf
