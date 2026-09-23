package in.gov.sgp.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IndiaLocationValidatorTest {

    private final IndiaLocationValidator validator = new IndiaLocationValidator();

    @Test
    void acceptsRequestedIndianLocations() {
        assertAll(
                () -> assertTrue(validator.isWithinIndia(18.5204, 73.8567)),
                () -> assertTrue(validator.isWithinIndia(19.0760, 72.8777)),
                () -> assertTrue(validator.isWithinIndia(28.6139, 77.2090)),
                () -> assertTrue(validator.isWithinIndia(12.9716, 77.5946))
        );
    }

    @Test
    void rejectsRequestedForeignLocations() {
        assertAll(
                () -> assertFalse(validator.isWithinIndia(40.7128, -74.0060)),
                () -> assertFalse(validator.isWithinIndia(51.5074, -0.1278)),
                () -> assertFalse(validator.isWithinIndia(35.6762, 139.6503)),
                () -> assertFalse(validator.isWithinIndia(-33.8688, 151.2093))
        );
    }

    @Test
    void rejectsMissingAndOutOfRangeCoordinates() {
        assertAll(
                () -> assertFalse(validator.isWithinIndia(null, 78.9629)),
                () -> assertFalse(validator.isWithinIndia(20.5937, null)),
                () -> assertFalse(validator.isWithinIndia(91.0, 78.9629)),
                () -> assertFalse(validator.isWithinIndia(20.5937, 181.0))
        );
    }
}
