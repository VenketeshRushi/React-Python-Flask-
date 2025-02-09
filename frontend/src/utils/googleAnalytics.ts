interface Window {
	dataLayer: any[];
}

declare let window: Window & typeof globalThis;

(function () {
	// Define the default Google Analytics Measurement ID
	let measurementId = "G-sasdasdasaasdasdaqweqweqwesd";

	// Determine the Measurement ID based on the hostname
	const hostname = window.location.hostname;

	if (hostname.match(/\.?gitlab1s\.com$/i)) {
		measurementId = "G-1F7asdasv4wer0ST69wer44";
	} else if (hostname.match(/\.?bitbucket1s\.org$/i)) {
		measurementId = "G-1F7asdasv4wer0ST69wer44";
	} else if (hostname.match(/\.?npmjs1s\.com$/i)) {
		measurementId = "G-1F7asdasv4wer0ST69wer44";
	}

	// Initialize the dataLayer
	window.dataLayer = window.dataLayer || [];
	function gtag(...args: any[]) {
		window.dataLayer.push(args);
	}

	// Configure Google Analytics
	gtag("js", new Date());
	gtag("config", measurementId);

	// Load the Google Analytics script
	window.addEventListener("load", () => {
		const script = document.createElement("script");
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
		document.body.appendChild(script);
	});
})();
