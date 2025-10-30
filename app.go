package main

import (
	"context"
	"fmt"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet приветствует пользователя
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}
