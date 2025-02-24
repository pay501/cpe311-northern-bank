package pkg

import (
	"fmt"
	"runtime"
)

func GetCallerInfo() string {
	// Skip 1 frame to get the caller of getCallerInfo
	_, file, line, ok := runtime.Caller(1)
	if !ok {
		return "unknown:0"
	}
	return fmt.Sprintf("%s:%d", file, line)
}
