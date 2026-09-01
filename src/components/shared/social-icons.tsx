import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 8.5h2V5.6c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.84-4.92 5.22v2.58H6.25v3.25h3.88V21h3.37v-4.5h3.23l.5-3.25h-3.73v-2.24c0-.94.26-1.51 1.5-1.51Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
        fill="currentColor"
      />
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.09-1.53a9.86 9.86 0 0 0 4.95 1.34c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 17.9a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.02.91.9-2.95-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.56-3.71 8.27-8.27 8.27Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function ViberIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.03 2.4c-2.6 0-5.05.62-6.9 2.05C3.1 6.02 2 8.31 2 11.05c0 2.6 1.24 5.15 3.4 6.7v3.1c0 .3.35.47.6.29l3.16-2.24c.9.2 1.86.31 2.87.31 5.3 0 9.97-3.35 9.97-8.86 0-5.13-4.47-8.95-9.97-8.95Zm4.5 10.5c-.14.36-.8.72-1.13.77-.29.04-.66.06-1.06-.07-.24-.08-.56-.18-.96-.36-1.69-.73-2.8-2.44-2.88-2.55-.08-.11-.7-.93-.7-1.78s.44-1.26.6-1.43c.15-.17.33-.21.44-.21.11 0 .22 0 .32.005.1.005.24-.04.38.29.14.34.48 1.18.52 1.26.04.09.07.19.01.3-.06.11-.09.18-.18.28-.09.1-.19.22-.27.3-.09.09-.19.19-.08.37.11.19.49.81 1.05 1.31.72.64 1.33.84 1.52.93.19.09.3.08.41-.05.11-.13.47-.55.6-.74.13-.19.25-.16.42-.1.17.06 1.08.51 1.27.6.19.1.31.14.36.22.04.09.04.5-.1.86Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.94 3.79a1.4 1.4 0 0 0-1.42-.24L2.6 10.4a1.36 1.36 0 0 0 .07 2.55l4.55 1.47 1.76 5.64a1 1 0 0 0 .95.7.98.98 0 0 0 .78-.38l2.53-3.13 4.68 3.46a1.36 1.36 0 0 0 2.15-.83l2.3-14.24a1.4 1.4 0 0 0-.43-1.85ZM9.53 14.06l-.45 3.14-1.03-3.3 9.66-7.13-8.18 7.29Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.15" cy="6.85" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="2.5"
        fill="currentColor"
        opacity="0.001"
      />
      <path
        d="M7.6 9.6H4.5V19h3.1V9.6ZM6.05 8.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM19.5 19h-3.1v-5.05c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V19h-3.1V9.6h2.98v1.28h.04c.42-.78 1.42-1.6 2.92-1.6 3.12 0 3.7 2.06 3.7 4.73V19Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M10.5 9.7 15 12l-4.5 2.3V9.7Z" fill="currentColor" />
    </svg>
  );
}
