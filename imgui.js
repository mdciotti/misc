// Immediate Mode GUI
// https://www.youtube.com/watch?v=Z1qyvQsjK5Y

function doButton(ui, id, text, ...) {
	if (active) {
		if (mouseWentUp) {
			if (hot) {
				result = true
			}
			setNotActive
		}
	} else if (hot) {
		if (mouseWentDown) {
			setActive
		}
	}

	if (inside) {
		setHot
	}

	// ... draw code
}
