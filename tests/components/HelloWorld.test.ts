import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Hello, world!';
    const wrapper = mount(HelloWorld, {
      props: { msg },
    });
    expect(wrapper.text()).toContain(msg);
  });
});
