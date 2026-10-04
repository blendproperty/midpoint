export default function EstateMap() {
  return (
        <div className="relative mt-16 h-72 w-full overflow-hidden rounded-card md:h-96">
          <iframe
            title="Map of Midpoint Business Park"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.0622489060165!2d28.121084777120107!3d-25.998778177203732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e956e055e9b7cb9%3A0x6612fda1aab019bf!2s162%20Tonetti%20St%2C%20Halfway%20House%2C%20Midrand%2C%201685%2C%20South%20Africa!5e0!3m2!1sen!2suk!4v1741856151377!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
          <div className="pointer-events-none absolute inset-0 bg-midpoint-dark/35" />
        </div>
  );
}
