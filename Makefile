.PHONY: all help production clean distclean dev

help:
	@echo "Target        | Explanation"
	@echo "production    | Run a complete production build from scratch."
	@echo "release-notes | Generate or refresh release notes from clickup"
	@echo "dev           | alias for npx docusaurus run"
	@echo "world         | distclean, production and then dev"
	@echo "clean         | remove module cache and build directories"
	@echo "distclean     | runs clean, and also removes .docusaurus and lockfiles"
	@echo "help          | this help screen (and default if no other argument is given)"

all: help

production:
	@echo "Creating production build"
	npm install && npm run build || true

clean:
	@echo "Removing module cache & build directory"
	rm -rf node_modules build

distclean: clean
	@echo "Removing .docusaurus instance and package locks"
	rm -rf .docusaurus package-lock.json yarn.lock

release-notes:
	@echo Coming Soon ...

dev:
	@echo "Creating Development Environment"
	npx docusaurus start

world: distclean production dev
