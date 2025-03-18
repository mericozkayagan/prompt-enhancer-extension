# Makefile for Prompt Enhancer Extension
#
# This Makefile provides commands for building, testing, and packaging the extension

# Variables
EXTENSION_NAME = prompt-enhancer-extension
VERSION = $(shell node -p "require('./package.json').version")
NODE_BIN = ./node_modules/.bin
VSCE = $(NODE_BIN)/vsce
TSC = $(NODE_BIN)/tsc

# Default target
.PHONY: all
all: clean install build package

# Install dependencies
.PHONY: install
install:
	@echo "Installing dependencies..."
	npm ci

# Development build with watch mode
.PHONY: dev
dev:
	npm run watch

# Build the extension
.PHONY: build
build:
	@echo "Building extension..."
	$(TSC) -p ./

# Package the extension as VSIX
.PHONY: package
package: build
	@echo "Packaging extension as VSIX..."
	$(VSCE) package
	@echo "Package created: $(EXTENSION_NAME)-$(VERSION).vsix"

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist
	rm -f *.vsix

# Run TypeScript compiler in watch mode
.PHONY: watch
watch:
	$(TSC) -watch -p ./

# Publish the extension (requires VSCE token)
.PHONY: publish
publish: package
	@echo "Publishing extension..."
	$(VSCE) publish

# Help command
.PHONY: help
help:
	@echo "Prompt Enhancer Extension Makefile"
	@echo ""
	@echo "Available commands:"
	@echo "  make              - Default: clean, install dependencies, build, and package"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build the extension"
	@echo "  make package      - Create a VSIX package"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make dev          - Run TypeScript compiler in watch mode for development"
	@echo "  make watch        - Run TypeScript compiler in watch mode"
	@echo "  make publish      - Publish the extension (requires VSCE token)"
	@echo "  make help         - Show this help message"