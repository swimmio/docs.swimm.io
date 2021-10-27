# Building Swimm RPM Packages

Swimm's official release channels are Windows, MacOS & Ubuntu (which also covers other Debian-based GNU/Linux distriubtions). However, it's possible to extract the contents of the Ubuntu package, and turn it into an `.rpm` file, suitable for installation on Fedora or CentOS distributions. In this quick tutorial, we'll show you how to accomplish this from the point of view of using Fedora Relase 32 (x86_64)

This tutorial will take approximately 15 minutes to complete. 

:::caution This Is An Advanced Tutorial And There Are Risks

This is an advanced tutorial for users that are comfortable making their own packages and installing them as root. While the risk is small, you can damage your operating system if you make a mistake. We recommend trying this on a virtual machine that matches your workstation first. We offer no warranty or guarantee for this tutorial; you assume the risk if you proceed.

:::

## Step One - Download The Swimm .deb Package

Get the latest GNU/Linux package from the [Swimm Download Page](https://swimm.io/download/). In this tutorial, we'll assume the file was saved to `~/Downloads/Swimm-x.y.z.deb`. Where *x.y.z* represents the version numbers, like `0.5.0`. Make sure you choose to save the file, and not open it with the archive manager. 

## Step Two - Install Alien

[Alien](https://en.wikipedia.org/wiki/Alien_(file_converter)) is a utility that allows you to take the contents of a package intended to install something on operating system A, and convert it to install something on operating system B instead, as well as the reverse. Sometimes, alien can just install foreign packages for you without any other fuss. In our case, we'll have a few more steps to complete.

To install it on Fedora, type:

```bash
$ sudo dnf install alien
```

You can also just type `alien`; the shell will recognize it and ask if you'd like to install it. 

## Step Three - Unpack The .deb And Do Some Minor Surgery

First, let's unpack the `.deb` package in a directory so that we can work with the contents. Then we need to change to that directory. We use `alien` to do this for us: 

```bash
$ alien -r -g -v SwimmInstaller.deb
$ cd swimm-x.y.z
```

Don't worry about warnings regarding not being root, we're not going to use alien to rebuild the archive, we'll use `rpmbuild` later instead.

Next, we need to edit the `swimm-x.y.z/swimm-x.y.z-n.spec` file in whatever editor you like. Make the following changes:

 - Around line 5, put something next to `Summary:` , e.g. change it to be `Summary: Swimm`
 - Remove the line that says `%dir "/"` under `%files` (this is probably line 21)
 - Remove the line that says `%dir "/opt"` under `%files` (this is probably line 52)

Now, add the following lines just above the line that says `%files` (post-install scripts have to come before the files):

```sh
%post
/opt/Swimm/resources/dev/post_install.sh
```

This will make sure symplinks in `/usr/local/bin` are created upon installation. Save the file.

Now, we have to make the shell scripts that will be installed executable. Since they will eventually be installed in `/opt`, that's how they're staged inside of our packaging directory. So note that we're actually changing the attributes of `~/Downloads/swimm-x.y.z/opt/Swimm

```bash
$ chmod +x opt/Swimm/resources/dev/*.sh
$ chmod +x opt/Swimm/resources/bin/*.sh
```

Then, change out of the unpacked directory (`cd ..`) because it's going to be consumed and removed in the next step. 

## Step Four - Build the RPM

Now, we just have to build the RPM, which we'll use `rpmbuild` to do for us. This can take a few minutes as there's a bit that needs to be packed up in the resulting `.rpm`.

```bash
$ rpmbuild --buildroot ~/Downloads/swimm-x.y.z -bb ~/Downloads/swimm-0.5.0/swimm-x.y.z-n.spec
```

When that finishes, you'll see the end of the script:

```sh
Wrote: ../swimm-x.y.z-1.x86_64.rpm
Executing(%clean): /bin/sh -e /var/tmp/rpm-tmp.xxuRBE
+ umask 022
+ cd /home/username/rpmbuild/BUILD
+ /usr/bin/rm -rf /home/username/Downloads/swimm-x.y.z
+ RPM_EC=0
++ jobs -p
+ exit 0
```

Now, optionally, we can be sure that the post-install scripts were packaged properly, by querying the package to be sure:

```bash
$ rpm -q --scripts swimm-x.y.z-n.x86_64.rpm
postinstall scriptlet (using /bin/sh):
/opt/Swimm/resources/dev/post_install.sh
```

Great, all we'll need to do is install the RPM!

## Step Five - Done!

There's a shiny new `.rpm` file in the home directory! If this is your first time installing Swimm, install it as such:

```bash
$ cd ..
$ sudo rpm -i swimm-x.y.z-n.x86_64.rpm
```

If you're upgrading, you probably want to run `rpm -U` instead of `rpm -i`. Additionally, you can remove the package entirely by using `rpm -e`.

Ultimately, test the installation by typing `swimm --version`, or `swimm start`. 