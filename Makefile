SHELL := /bin/bash

.DEFAULT_GOAL := help

DOCKER_COMPOSE ?= docker compose

.PHONY: help up down logs verify seed

help:
@echo "Available targets:"
@echo "  make up       - Start the MING + Frigate stack"
@echo "  make down     - Stop the stack"
@echo "  make logs     - Tail logs from all services"
@echo "  make verify   - Run scripts/verify_stack.sh"
@echo "  make seed     - Seed InfluxDB with example data"

up:
$(DOCKER_COMPOSE) up -d

up-build:
$(DOCKER_COMPOSE) up -d --build

down:
$(DOCKER_COMPOSE) down

logs:
$(DOCKER_COMPOSE) logs -f

verify:
bash scripts/verify_stack.sh

seed:
bash scripts/seed_influx_bucket.sh
